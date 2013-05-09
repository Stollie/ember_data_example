<?php
/**
 * Description of exercise
 *
 * @author Remco
 */
class Exercises_Controller extends Base_Controller {

    public $restful = true;
 
    public function get_index($id = null)
    {
	// Get all exercises
        if (is_null($id)) {
	    return Response::json('Not used', 404);
            // Change json for Ember.js
            //return Response::json(array('exercises' => json_decode(Response::eloquent(Exercise::all()))));
            //return Response::eloquent(Exercise::all()); is default
        }
        else {
            $exercise_object = Exercise::find($id);
            
            if (is_null($exercise_object)){
                return Response::json('Log not found', 404);
            } else {
                $exercise['id'] = $exercise_object->id;
                $exercise['name'] = $exercise_object->name;
                $exercise['created_at'] = $exercise_object->created_at;
  
                // id list maken voor ember.js
                foreach ($exercise_object->motionlogs()->get() as $key ) {
                    $exercise['motionlog_ids'][] = $key->id;
                }
                return Response::json(array(
                    'exercise' => $exercise,
                    'motionlogs' => json_decode(Response::eloquent($exercise_object->motionlogs()->get()))
                ));
            }
        }
    }

    public function post_index()
    {
        // Json ophalen
        $newexercise = Input::json();
        // Exercise maken
        $exercise = new Exercise();
        $exercise->name = $newexercise->name;
        $exercise->save();
        // Motionlogs van Exercise van opslaan
        $exercise->motionlogs()->save($this->_toArray($newexercise->motionlogs));
        return Response::eloquent($exercise);
    }

    public function put_index()
    {
        $update = Input::json();
 
        $exercise = Exercise::find($update->id);
        if(is_null($exercise)){
            return Response::json('Log not found', 404);
        }
//        $exercise->name = $update->name;
//        $exercise->save();
//        return Response::eloquent($exercise);
        return Response::eloquent($exercise);
    }
 
    public function delete_index($id = null)
    {
        $exercise = Exercise::find($id);
        if (is_null($exercise))
        {
             return Response::json('Exercise not found', 404);
        }
//        $deleted = $exercise;
//        $exercise->delete();   
        return Response::eloquent($deleted);  
    } 
    /*
     * Maak array's van objecten
     */
    private function _toArray($obj) {
        if(is_object($obj)) $obj = (array) $obj;
        if(is_array($obj)) {
          $new = array();
          foreach($obj as $key => $val) {
            $new[$key] = $this->_toArray($val);
          }
        }
        else { 
          $new = $obj;
        }
        return $new;
    }
}

?>
