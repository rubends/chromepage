<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Meeting;
use FOS\RestBundle\Controller\FOSRestController;
use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class MeetingController extends FOSRestController
{
    /**
     * @ParamConverter()
     * @ApiDoc()
     *
     * @param Meeting $meeting
     *
     * @return Meeting
     */
    public function getMeetingAction(Meeting $meeting)
    {
        return $meeting;
    }

    /**
     * @ApiDoc()
     *
     * @return Meeting[]
     */
    public function getMeetingsAction()
    {
        $user = $this->get('security.token_storage')->getToken()->getUser();
        return $this->getDoctrine()->getRepository('AppBundle:Meeting')->findByUserID($user->getId());
    }

    /**
     * @ApiDoc()
     *
     * @param Request $request
     *
     * @return Meeting[]
     */
    public function postMeetingsAction(Request $request)
    {
        $meeting = new Meeting();
        $meeting->setTitle($request->request->get('title'));
        $meeting->setTime($request->request->get('time'));

        $user = $this->get('security.token_storage')->getToken()->getUser();
        $meeting->setUserID($user->getId());


        $errors = $this->get('validator')->validate($meeting);
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

        $this->getDoctrine()->getManager()->persist($meeting);
        $this->getDoctrine()->getManager()->flush();

        return $this->getDoctrine()->getRepository('AppBundle:Meeting')->findByUserID($user->getId());
    }

    /**
     * @ApiDoc()
     *
     * @param Meeting $meeting
     *
     * @return Meeting[]
     */
    public function deleteMeetingAction(Meeting $meeting)
    {
        $this->getDoctrine()->getManager()->remove($meeting);
        $this->getDoctrine()->getManager()->flush();

        $user = $this->get('security.token_storage')->getToken()->getUser();
        return $this->getDoctrine()->getRepository('AppBundle:Meeting')->findByUserID($user->getId());
    }
}