<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Validator;

/**
 * @ORM\Entity()
 * @ORM\Table(name="meeting")
 */
class Meeting
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
    protected $title;

    /**
     * @ORM\Column(type="datetime")
     *
     * @var datetime
     */
    protected $time;

    /**
     * 
     * @ORM\Column(type="integer")
     *
     * @var int
     */
    protected $userID;

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
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * @param string $title
     */
    public function setTitle($title)
    {
        $this->title = $title;
    }


    /**
     * @return datetime
     *
     * @Validator\NotNull()
     */
    public function getTime()
    {
        return $this->time;
    }

    /**
     * @param datetime $time
     */
    public function setTime($time)
    {
        $this->time = $time;
    }

    /**
     * @return int
     *
     */
    public function getUserID()
    {
        return $this->userID;
    }

    /**
     * @param int $userID
     */
    public function setUserID($userID)
    {
        $this->userID = $userID;
    }
}