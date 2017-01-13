<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Task;
use FOS\RestBundle\Controller\FOSRestController;
use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class TaskController extends FOSRestController
{
    /**
     * @ParamConverter()
     * @ApiDoc()
     *
     * @param Task $task
     *
     * @return Task
     */
    public function getTaskAction(Task $task)
    {
        return $task;
    }

    /**
     * @ApiDoc()
     *
     * @return Task[]
     */
    public function getTasksAction()
    {
        $user = $this->get('security.token_storage')->getToken()->getUser();
        return $this->getDoctrine()->getRepository('AppBundle:Task')->findByUserID($user->getId());
    }

    /**
     * @ApiDoc()
     *
     * @param Request $request
     *
     * @return Task[]
     */
    public function postTasksAction(Request $request)
    {
        $task = new Task();
        $task->setTodo($request->request->get('todo'));
        $task->setDone("0");

        $user = $this->get('security.token_storage')->getToken()->getUser();
        $task->setUserID($user->getId());


        $errors = $this->get('validator')->validate($task);
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

        $this->getDoctrine()->getManager()->persist($task);
        $this->getDoctrine()->getManager()->flush();

        return $task;
    }

    /**
     * @ApiDoc()
     *
     * @param Task $task
     *
     * @return Task[]
     */
    public function deleteTaskAction(Task $task)
    {
        $this->getDoctrine()->getManager()->remove($task);
        $this->getDoctrine()->getManager()->flush();

        // $user = $this->get('security.token_storage')->getToken()->getUser();
        // return $this->getDoctrine()->getRepository('AppBundle:Task')->findByUserID($user->getId());
        return new JsonResponse(array('deleted' => $task));
    }

    /**
     * @ApiDoc()
     *
     * @param int $id
     *
     * @return Task[]
     */
    public function patchTaskToggleAction($id)
    {
        $em = $this->getDoctrine()->getManager();
        $task = $em->getRepository('AppBundle:Task')->find($id);
        $done = $task->getDone();

        if ($done==0) {
            $task->setDone('1');
        }
        else{
            $task->setDone('0');
        }

        $em->flush();
        $user = $this->get('security.token_storage')->getToken()->getUser();
        return $this->getDoctrine()->getRepository('AppBundle:Task')->findByUserID($user->getId());
    }
}