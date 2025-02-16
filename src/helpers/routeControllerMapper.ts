import { postController, userController } from "../Controllers";

export default function routeControllerMapper(path: string){
    switch (path) {
        case 'user': return userController
        case 'post': return postController
        break;
    
        default:
            break;
    }
}