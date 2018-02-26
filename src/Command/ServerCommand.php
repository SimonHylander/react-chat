<?php

/**
 * Created by PhpStorm.
 * User: shy
 * Date: 2018-01-03
 * Time: 22:47
 */

namespace App\Command;

use App\Server\Chat;
use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class ServerCommand extends ContainerAwareCommand {

    protected function configure() {
        $this->setName('chat:server')->setDescription('Start the server');
    }

    protected function execute(InputInterface $input, OutputInterface $output) {
        $server = IoServer::factory(new HttpServer(
            new WsServer(
                new Chat()
            )
        ), 8888);

        $server->run();
    }
}