<?php
class MotionLog extends Eloquent {

    //Another thing that Eloquent correctly assumes is that your table name
    //is the plural form of your model. For example, your User model will
    //reference the users table. As this might not always be the standard
    //for some, Laravel provides a way to override this: simply use the $table flag:
    //public static $table = 'motionlogs';
    
    
    //setting $timestamp to true so Eloquent
    //will automatically set the created_at
    //and updated_at values
    public static $timestamps = false;
     
    //Eloquent assumes that the foreign key used in User_Profile is the referenced
    //table.s name + _id. Again, if you want to change this behaviour,
    //you can override it:
    /*
    public function user_profile()
    {
        return $this->has_one('User_Profile', 'user_profile_user_id');
    }
    */
    //if we wanted to override the default naming convention
    //for the intermediate table, we can do it like so:
    //return $this->has_many_and_belongs_to('User', 'group_listings');
    /*
    public function followers()
    {
        return $this->has_many_and_belongs_to('User', 'relationships', 'followed_id', 'follower_id');
    }
    */ 
    /*
    public function photos()
    {
        return $this->has_many('Photo');
    }
    */

    public function exercise()
    {
        return $this->belongs_to('Exercise');
    }
}

