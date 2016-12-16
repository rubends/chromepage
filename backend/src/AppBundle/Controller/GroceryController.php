<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Grocery;
use FOS\RestBundle\Controller\FOSRestController;
use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class GroceryController extends FOSRestController
{
    /**
     * @ParamConverter()
     * @ApiDoc()
     *
     * @param Grocery $grocery
     *
     * @return Grocery
     */
    public function getGroceryAction(Grocery $grocery)
    {
        return $grocery;
    }

    /**
     * @ApiDoc()
     *
     * @return Grocery[]
     */
    public function getGrocerysAction()
    {
        $user = $this->get('security.token_storage')->getToken()->getUser();
        return $this->getDoctrine()->getRepository('AppBundle:Grocery')->findByUserID($user->getId());
    }

    /**
     * @ApiDoc()
     *
     * @param Request $request
     *
     * @return Grocery[]
     */
    public function postGrocerysAction(Request $request)
    {
        $grocery = new Grocery();
        $grocery->setItem($request->request->get('item'));
        $grocery->setDone("0");

        $user = $this->get('security.token_storage')->getToken()->getUser();
        $grocery->setUserID($user->getId());


        $errors = $this->get('validator')->validate($grocery);
        if (count($errors) > 0) {
            $errorStrings = [];
            foreach ($errors as $error) {
                $errorStrings[] = $error->getMessage();
            }
            return $this->view(
                [
                    'error' => implode(',', $errorStrings)
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        $this->getDoctrine()->getManager()->persist($grocery);
        $this->getDoctrine()->getManager()->flush();

        return $this->getDoctrine()->getRepository('AppBundle:Grocery')->findByUserID($user->getId());
    }

    /**
     * @ApiDoc()
     *
     * @param Grocery $grocery
     *
     * @return Grocery[]
     */
    public function deleteGroceryAction(Grocery $grocery)
    {
        $this->getDoctrine()->getManager()->remove($grocery);
        $this->getDoctrine()->getManager()->flush();

        $user = $this->get('security.token_storage')->getToken()->getUser();
        return $this->getDoctrine()->getRepository('AppBundle:Grocery')->findByUserID($user->getId());
    }

    // /**
    //  * @ApiDoc()
    //  *
    //  * @param int $id
    //  *
    //  * @return Grocery[]
    //  */
    // public function patchGroceryToggleAction($id)
    // {
    //     $em = $this->getDoctrine()->getManager();
    //     $grocery = $em->getRepository('AppBundle:Grocery')->find($id);
    //     $done = $grocery->getDone();

    //     if ($done==0) {
    //         $grocery->setDone('1');
    //     }
    //     else{
    //         $grocery->setDone('0');
    //     }

    //     $em->flush();
    //     $user = $this->get('security.token_storage')->getToken()->getUser();
    //     return $this->getDoctrine()->getRepository('AppBundle:Grocery')->findByUserID($user->getId());
    // }
}