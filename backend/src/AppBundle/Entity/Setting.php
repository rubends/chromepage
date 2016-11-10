<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Validator;

/**
 * @ORM\Entity()
 * @ORM\Table(name="settings")
 */
class Setting
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     *
     * @var int
     */
    protected $id;

    /**
     * @ORM\Column(type="string")
     *
     * @var string
     */
    protected $widget;

    /**
     * 
     * @ORM\Column(type="integer")
     *
     * @var int
     */
    protected $visible;

    /**
     * 
     * @ORM\Column(type="integer")
     *
     * @var int
     */
    protected $place;

    /**
     * @ORM\Column(type="string")
     *
     * @var string
     */
    protected $account;

    /**
     * 
     * @ORM\Column(type="integer")
     *
     * @var int
     */
    protected $userId;

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return string
     *
     * @Validator\NotNull()
     */
    public function getWidget()
    {
        return $this->widget;
    }

    /**
     * @param string $widget
     */
    public function setWidget($widget)
    {
        $this->widget = $widget;
    }

    /**
     * @return int
     *
     */
    public function getVisible()
    {
        return $this->visible;
    }

    /**
     * @param int $visible
     */
    public function setVisible($visible)
    {
        $this->visible = $visible;
    }

    /**
     * @return int
     *
     */
    public function getPlace()
    {
        return $this->place;
    }

    /**
     * @param int $place
     */
    public function setPlace($place)
    {
        $this->place = $place;
    }

    /**
     * @return string
     *
     * @Validator\NotNull()
     */
    public function getAccount()
    {
        return $this->account;
    }

    /**
     * @param string $account
     */
    public function setAccount($account)
    {
        $this->account = $account;
    }

    /**
     * @return int
     *
     */
    public function getUserId()
    {
        return $this->userId;
    }

    /**
     * @param int $userId
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
    }
}