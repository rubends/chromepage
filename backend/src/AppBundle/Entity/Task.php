<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Validator;

/**
 * @ORM\Entity()
 * @ORM\Table(name="task")
 */
class Task
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
    protected $todo;

    /**
     * 
     * @ORM\Column(type="integer")
     *
     * @var int
     */
    protected $done;

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
    public function getTodo()
    {
        return $this->todo;
    }

    /**
     * @param string $todo
     */
    public function setTodo($todo)
    {
        $this->todo = $todo;
    }

    /**
     * @return int
     *
     */
    public function getDone()
    {
        return $this->done;
    }

    /**
     * @param int $done
     */
    public function setDone($done)
    {
        $this->done = $done;
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

    /**
     * @param string $todo
     * @param int $done
     * @param int $userID
     */
    public function setAll($todo, $done, $userID)
    {
        $this->todo = $todo;
        $this->done = $done;
        $this->userID = $userID;
    }
}