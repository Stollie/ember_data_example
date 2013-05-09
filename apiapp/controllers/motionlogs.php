<?php
class Motionlogs_Controller extends Base_Controller {

    public $restful = true;
 
    public function get_index($id = null)
    {
        if (is_null($id))
        {
            // Eindelijk goed.
            return Response::json(array('motionlogs' => json_decode(Response::eloquent(MotionLog::all()))));
        }
        else
        {
            $log = MotionLog::find($id);
 
            if(is_null($log)){
                return Response::json('Log not found', 404);
            } else {
//                return json_encode(array('motionlog' => json_decode(Response::eloquent($log))));
                return Response::eloquent($log);
            }
        }
    }
 
    public function post_index()
    {
        $newlog = Input::json();

        $log = new MotionLog();
        $log->exercise_id = $newlog->exercise_id;
        $log->roll = $newlog->roll;
        $log->pitch = $newlog->pitch;
        $log->yaw = $newlog->yaw;
        $log->accelX = $newlog->accelX;
        $log->accelY = $newlog->accelY;
        $log->accelZ = $newlog->accelZ;
        $log->gyroX = $newlog->gyroX;
        $log->gyroY = $newlog->gyroY;
        $log->gyroZ = $newlog->gyroZ;
        $log->save();

        return Response::eloquent($log);
    }
 /*
    public function put_index()
    {
        $update = Input::json();
 
        $log = MotionLog::find($update->id);
        if(is_null($log)){
            return Response::json('Log not found', 404);
        }
        $log->xyz = $update->xyz;
        $log->save();
        return Response::eloquent($log);
    }
*/
/*
    public function delete_index($id = null)
    {
        $log = MotionLog::find($id);
 
        if(is_null($log))
        {
             return Response::json('Log not found', 404);
        }
        $deleted = $log;
        $log->delete();    
        return Response::eloquent($deleted);  
    } 
*/
}
