import { useParams } from "react-router-dom"
import UserContainer from "../containers/UserContainer"

const UserPage = () => {
  const { id }= useParams()
  return <UserContainer id={id} />
}

export default UserPage