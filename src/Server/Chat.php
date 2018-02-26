<?php

/**
 * Created by PhpStorm.
 * User: shy
 * Date: 2018-01-03
 * Time: 22:58
 */

namespace App\Server;

use Ratchet\ConnectionInterface;
use Ratchet\MessageComponentInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

class Chat implements MessageComponentInterface {

    private $container;
    private $connections;
    private $rooms;
    private $users;

    public function __construct() { //ContainerInterface $container
        $this->connections = new \SplObjectStorage;

        $this->rooms = array(
            array(
                'id' => 1,
                'name' => 'General',
                'users' => array(),
                'messages' => array()
            )
        );

        $this->users = array();

        echo "Chat server started! \n";
    }

    /**
     * A new websocket connection
     *
     * @param ConnectionInterface $conn
     */
    public function onOpen(ConnectionInterface $connnection) {
        //store connection
        $this->connections->attach($connnection);

        $userId = $connnection->resourceId;

        $user = array(
            'id' => $userId,
            'username' => null,
            'join_date' => date('Y-m-d H:i:s')
        );

        foreach($this->rooms as $key => $room) {
            if($room['name'] == 'General') {
                $this->rooms[$key]['users'][] = $user;
            }
        }

        $this->sendRoomList();

        $this->broadcastMessage('USER_CONNECTED', json_encode(array(
            'type' => 'USER_CONNECTED',
            'data' => array(
                'room_id' => 1,
                'user' => $user
            )
        )));

        echo "New connection: {$userId} \n";
    }

    /**
     * Handle message sending
     *
     * @param ConnectionInterface $from
     * @param string $msg
     */
    public function onMessage(ConnectionInterface $from, $msg) {
        $decoded = json_decode($msg);
        $messageType = $decoded->type;
        $messageData = $decoded->data;

        if($messageType === 'CHECK_USERNAME') {

            if(strlen($messageData->username) < 3) {
                $from->send(json_encode(array(
                    'type' => 'MESSAGE_NAME_TOO_SHORT',
                    'data' => null
                )));

                return;
            }

            if(strlen($messageData->username) > 14) {
                $from->send(json_encode(array(
                    'type' => 'MESSAGE_NAME_TOO_LONG',
                    'data' => null
                )));

                return;
            }

            if(array_search($messageData->username, array_column($this->users, 'username')) !== false) {
                $from->send(json_encode(array(
                    'type' => 'USERNAME_IN_USE',
                    'data' => null
                )));

                return;
            }

            $from->send(json_encode(array(
                'type' => 'MESSAGE_USERNAME_VALID',
                'data' => array(
                    'username' => $messageData->username
                )
            )));

            return;
        }

        if($messageType === 'MESSAGE_REQUEST_USERNAME') {
            if(strlen($messageData->username) < 3)
                return;

            if(strlen($messageData->username) > 14)
                return;

            foreach($this->rooms as $roomIndex => $room) {
                foreach($room['users'] as $userIndex => $user) {
                    if($user['id'] === $from->resourceId) {
                        $this->rooms[$roomIndex]['users'][$userIndex]['username'] = $messageData->username;
                    }
                }
            }

            $from->send(json_encode(array(
                'type' => 'MESSAGE_USERNAME_GRANTED',
                'data' => array(
                    'username' => $messageData->username
                )
            )));

            $this->broadcastMessage($from, json_encode(array(
                'type' => 'USER_STATE_CHANGE',
                'data' => array(
                    'room_id' => 1,
                    'user_id' => $from->resourceId,
                    'username' => $messageData->username,
                    'timestamp' => date('Y-m-d H:i:s')
                )
            )));

            return;
        }

        if($messageType === 'CHAT_MESSAGE') {
            $room = $this->getRoom($messageData->roomId);

            foreach($room['users'] as $key => $user) {
                if($from->resourceId == $user['id']) {

                    $this->broadcastMessage($from, json_encode(array(
                        'type' => 'USER_MESSAGE',
                        'data' => array(
                            'id' => $user['id'],
                            'username' => $user['username'],
                            'message' => $messageData->message,
                            'timestamp' => date('Y-m-d H:i:s')
                        )
                    )));

                    return;
                }
            }

            return;
        }

        /*if(decoded.type === p.MESSAGE_CHECK_NICKNAME) {
            if(decoded.data.nickname.length < 3) {
                ws.send(JSON.stringify({
                    type: p.MESSAGE_NAME_TOO_SHORT,
                    data: null
                }))

                return
            }

            if(decoded.data.nickname.length > 14) {
                ws.send(JSON.stringify({
                    type: p.MESSAGE_NAME_TOO_LONG,
                    data: null
                }))

                return
            }

            if(users.filter(u => u.nickname == decoded.data.nickname).length) {
                ws.send(JSON.stringify({
                    type: p.MESSAGE_NAME_IN_USE,
                    data: null
                }))

                return
            }

            ws.send(JSON.stringify({
                type: p.MESSAGE_NICKNAME_VALID,
                data: null
            }))
            return
        }*/

        /*$messageData = json_decode(trim($msg));

        if(isset($messageData->userData)){
            //1st app message with connected user
            $token_user = $messageData->userData;

            //a user auth, else, app sending message auth
            echo "Check user credentials\n";
            //get credentials
            $jwt_manager = $this->container->get('lexik_jwt_authentication.jwt_manager');
            $token = new JWTUserToken();
            $token->setRawToken($token_user);
            $payload = $jwt_manager->decode($token);

            //getUser by email
            if(!$user = $this->getUserByEmail($payload['username'])){
                $from->close();
            }
            echo "User found : ".$user->getFirstname() . "\n";
            $index_connection = $payload['username'];

            $all_connections = $this->connections;
            foreach($all_connections as $key => $conn){
                if($conn === $from){
                    $this->connections[$index_connection] = $from;
                    $from->send('..:: Connected as '.$index_connection.'  ::..');
                    unset($this->connections[$key]);
                    break;
                } else {
                    continue;
                }

            }
        } else {
            //error
            $from->send("You're not able to do that!");
        }*/
    }

    /**
     * A connection is closed
     * @param ConnectionInterface $conn
     */
    public function onClose(ConnectionInterface $connection) {
        $this->connections->detach($connection);

        foreach($this->rooms as $roomIndex => $room) {

            foreach($room['users'] as $userIndex => $user) {
                if($user['id'] === $connection->resourceId) {
                    unset($room['users'][$userIndex]);
                }
            }
        }

        $this->broadcastMessage('USER_LEFT', json_encode(array(
            'id' => $connection->resourceId
        )));

        echo "Disconnected\n";
    }

    /**
     * Error handling
     *
     * @param ConnectionInterface $conn
     * @param \Exception $e
     */
    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "An error has occurred: {$e->getMessage()}";
        $conn->close();
    }

    private function broadcastMessage($from, $message) {
        foreach($this->connections as $client) {
            $client->send($message);
        }
    }

    private function sendUserList() {

        foreach($this->connections as $connection) {
            $users = array();

            foreach($this->users as $user) {
                $users[] = array(
                    'id' => $user['id'],
                    'username' => $user['username']
                );
            }

            $connection->send(json_encode(array(
                'type' => 'USER_LIST',
                'data' => $users
            )));
        }
    }

    private function sendRoomList() {

        foreach($this->connections as $connection) {
            $connection->send(json_encode(array(
                'type' => 'ROOM_LIST',
                'data' => $this->rooms
            )));
        }
    }

    private function getRoom(int $roomId) {
        $targetRoonm = null;

        foreach($this->rooms as $room) {
            if($room['id'] === $roomId) {
                $targetRoonm = $room;
            }
        }

        return $targetRoonm;
    }
}