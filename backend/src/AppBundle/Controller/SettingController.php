<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Setting;
use FOS\RestBundle\Controller\FOSRestController;
use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class SettingController extends FOSRestController
{
    /**
     * @ParamConverter()
     * @ApiDoc()
     *
     * @param Setting $setting
     *
     * @return Setting
     */
    public function getSettingAction(Setting $setting)
    {
        return new JsonResponse(array('API' => "Get setting."));
    }

    /**
     * @ApiDoc()
     *
     * @return Setting[]
     */
    public function getSettingsAction()
    {
        $user = $this->get('security.token_storage')->getToken()->getUser();
        return $this->getDoctrine()->getRepository('AppBundle:Setting')->findByUserId($user->getId());
    }

    /**
     * @ApiDoc()
     *
     * @return Setting[]
     */
    public function postSettingsUserAction()
    {
        $user = $this->get('security.token_storage')->getToken()->getUser();
        $userId = $user->getId();

        $place = -1; //every widget gets the next place
        $widgets = ['todo', 'weather', 'joke', 'catGifs'];
        foreach ($widgets as $widget) {
            $setting = new Setting();
            $setting->setWidget($widget);
            $setting->setVisible(0);
            $place++;
            $setting->setPlace($place);
            $setting->setSize(2);
            $setting->setUserId($userId);
            if ($widget == 'weather') {
                $setting->setAccount("Stuttgart");
            }
            else 
            {
                $setting->setAccount("no");
            }
            $this->getDoctrine()->getManager()->persist($setting);
            $this->getDoctrine()->getManager()->flush();
        }
        return new JsonResponse(array('API' => "Post setting."));
    }

    /**
     * @ApiDoc()
     *
     * @param Setting $setting
     *
     * @return Setting[]
     */
    public function deleteSettingAction(Setting $setting)
    {
        return new JsonResponse(array('API' => "Delete setting."));
    }

    /**
     * @ApiDoc()
     *
     * @param int $id
     *
     * @return int
     */
    public function patchSettingToggleAction($id)
    {
        $em = $this->getDoctrine()->getManager();
        $setting = $em->getRepository('AppBundle:Setting')->find($id);
        $visible = $setting->getVisible();

        if ($visible==0) {
            $setting->setVisible(1);
            $updateVis = 1;
        }
        else{
            $setting->setVisible(0);
            $updateVis = 0;
        }

        $em->flush();
        return $updateVis;
    }

    /**
     * @ApiDoc()
     *
     * @param int $id
     * @param string $account
     *
     * @return Setting[]
     */
    public function patchSettingAccountAction($id, $account)
    {
        $em = $this->getDoctrine()->getManager();
        $setting = $em->getRepository('AppBundle:Setting')->find($id);

        $setting->setAccount($account);

        $em->flush();
        return new JsonResponse(array('API' => "Changed account setting."));
    }

    /**
     * @ApiDoc()
     *
     * @param int $id
     * @param int $place
     *
     * @return Setting[]
     */
    public function patchSettingPlaceAction($id, $place)
    {
        $em = $this->getDoctrine()->getManager();
        $setting = $em->getRepository('AppBundle:Setting')->find($id);

        $setting->setPlace($place);

        $em->flush();
        return new JsonResponse(array('API' => "Changed place setting."));
    }

    /**
     * @ApiDoc()
     *
     * @param int $id
     * @param int $size
     *
     * @return Setting[]
     */
    public function patchSettingSizeAction($id, $size)
    {
        $em = $this->getDoctrine()->getManager();
        $setting = $em->getRepository('AppBundle:Setting')->find($id);

        $setting->setSize($size);

        $em->flush();
        return new JsonResponse(array('API' => "Changed size setting."));
    }
}