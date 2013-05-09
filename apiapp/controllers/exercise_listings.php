<?php
/**
 * Description of exercise listing
 *  lijst met exercises voor menu
 * @author Remco
 */
class Exercise_listings_Controller extends Base_Controller {
 
    public $restful = true;

    public function get_index()
    {
        return Response::json(array('exercise_listings' => json_decode(Response::eloquent(Exercise::order_by('created_at', 'desc')->get()))));
    }
}
