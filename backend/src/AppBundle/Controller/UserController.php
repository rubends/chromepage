<?php

namespace AppBundle\Controller;

use AppBundle\Entity\User;
use FOS\RestBundle\Controller\FOSRestController;
use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class UserController extends FOSRestController
{
    /**
     * @ParamConverter()
     * @ApiDoc()
     *
     * @return User
     */
    public function getUserAction()
    {
        $user = $this->get('security.token_storage')->getToken()->getUser();
        return $user;
    }

    /**
     * @ApiDoc()
     *
     * @return User[]
     */
    public function getUsersAction()
    {
        return $this->getDoctrine()->getRepository('AppBundle:User')->findAll();
    }

    /**
     * @ApiDoc()
     *
     * @param Request $request
     *
     * @return User
     */
    public function postUsersRegisterAction(Request $request)
    {
        $data = $request->request->all();

        if ($data['password']==$data['passwordRepeat']) {

            $repository = $this->getDoctrine()->getRepository('AppBundle:User');
            if (!$repository->findOneByEmail($data['email'])) {

                $user = new User();
                $user->setEmail($data['email']);
                $user->setName($data['name']);
                $user->setRole("ROLE_USER");
                $user->setBackgroundColor("#ffffff");
                $user->setWidgetColor("#ffffff");
                $user->setHeaderColor("#f5f5f5");
                $user->setFontColor("#333333");

                $encoder = $this->container->get('security.password_encoder');
                $encoded = $encoder->encodePassword($user, $data['password']);
                $user->setPassword($encoded);

                $this->getDoctrine()->getManager()->persist($user);
                $this->getDoctrine()->getManager()->flush();
                return $this->generateToken($user, 201);
            }

            return new JsonResponse(array('error' => "Emailadres is already taken."));
        }

        return new JsonResponse(array('error' => "passwords don't match"));
    }

    protected function generateToken($user, $statusCode = 200)
    {
        // Generate the token
        $token = $this->get('lexik_jwt_authentication.jwt_manager')->create($user);

        $response = array(
            'token' => $token,
            'name'  => $user->getName(),
            'email' => $user->getEmail(),
            'background_color' => $user->getBackgroundColor(),
            'widget_color' => $user->getWidgetColor(),
            'header_color' => $user->getHeaderColor(),
            'font_color' => $user->getFontColor()
        );

        return new JsonResponse($response, $statusCode); // Return a 201 Created with the JWT.
    }

    /**
     * @ApiDoc()
     *
     * @param Request $request
     *
     * @return User
     */

    public function postUsersLoginAction(Request $request){
        $email = $request->request->get('email');
        $password = $request->request->get('password');

        if(is_null($email) || is_null($password)) {
            return new JsonResponse(array('error' => "Not all fields are filled."));
        }

        $repository = $this->getDoctrine()->getRepository('AppBundle:User');
        $user = $repository->findOneByEmail($email);

        if (!$user) {
            return new JsonResponse(array('error' => "Email is not valid."));
        }

        $encoder = $this->container->get('security.password_encoder');
        if($encoder->isPasswordValid($user, $password)) {
              return $this->generateToken($user, 201);
        } else {
            return new JsonResponse(array('error' => "Password is not valid."));
        }
    }

    /**
     * @ApiDoc()
     *
     * @param User $user
     *
     * @return Response
     */
    public function deleteUserAction(User $user)
    {
        $this->getDoctrine()->getManager()->remove($user);
        $this->getDoctrine()->getManager()->flush();

        return new Response('User deleted', Response::HTTP_NO_CONTENT);
    }

    /**
     * @ApiDoc()
     *
     * @param string $option
     * @param int $color
     *
     * @return User[]
     */
    public function patchUserColorAction($option, $color)
    {
        $em = $this->getDoctrine()->getManager();
        $user = $this->get('security.token_storage')->getToken()->getUser();

        if ($option == "backgroundcolor") {
            $user->setBackgroundColor($color);
        }
        if ($option == "widgetcolor") {
            $user->setWidgetColor($color);
        }
        if ($option == "headercolor") {
            $user->setHeaderColor($color);
        }
        if ($option == "fontcolor") {
            $user->setFontColor($color);
        }
        

        $em->flush();
        return new JsonResponse(array('API' => "Changed color setting."));
    }
}