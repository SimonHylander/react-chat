<?php

/**
 * Created by PhpStorm.
 * User: shy
 * Date: 2018-01-02
 * Time: 00:13
 */

namespace App\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class MainController extends Controller {

    /**
     * @Route("/", name="main")
     * @Method("GET")
     */
    public function main() {
        return $this->render('index.html.twig');
    }

    /**
     * @Route("/main", name="main2")
     * @Method("GET")
     */
    public function main2() {
        return $this->render('index.html.twig');
    }
}