<?php
/**
 * Created by PhpStorm.
 * User: shy
 * Date: 2018-01-07
 * Time: 22:05
 */

namespace App\Server;

use Ratchet\ConnectionInterface;
use Ratchet\MessageComponentInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

class Notification implements MessageComponentInterface {

    protected $connections = array();
    protected $container;

    public function __construct() {
        echo "Started server \n";
    }

    /**
     * A new websocket connection
     *
     * @param ConnectionInterface $conn
     */
    public function onOpen(ConnectionInterface $conn) {
        $this->connections[] = $conn;
        $conn->send('..:: Hello from the Notification Center ::..');
        echo "New connection \n";
    }

    /**
     * Handle message sending
     *
     * @param ConnectionInterface $from
     * @param string $msg
     */
    public function onMessage(ConnectionInterface $from, $msg) {
        $messageData = json_decode(trim($msg));

        var_dump($messageData);

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
        }

    }

    /**
     * A connection is closed
     * @param ConnectionInterface $conn
     */
    public function onClose(ConnectionInterface $conn)
    {
        foreach($this->connections as $key => $conn_element){
            if($conn === $conn_element){
                unset($this->connections[$key]);
                break;
            }
        }
    }

    /**
     * Error handling
     *
     * @param ConnectionInterface $conn
     * @param \Exception $e
     */
    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        $conn->send("Error : " . $e->getMessage());
        $conn->close();
    }
}