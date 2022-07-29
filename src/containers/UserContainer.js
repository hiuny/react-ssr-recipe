import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Preloader } from "../lib/PreloadContext"
import { getUser } from "../modules/users"
import User from "../components/User"

const UserContainer = ({ id }) => {
  const user = useSelector(state => state.users.user)
  const dispatch = useDispatch()

  useEffect(() => {
    if (user?.id === parseInt(id, 10)) return // 사용자가 존재하고, id가 일치한다면 요청하지 않음
    dispatch(getUser(id))
  }, [dispatch, id, user])

  if (!user) {
    // 컨테이너 유효성 검사 후 return null을 해야 하는 경우에
    // null 대신 Preloader 반환
    return <Preloader resolve={() => dispatch(getUser(id))} />
  }
  return <User user={user} />
}

export default UserContainer