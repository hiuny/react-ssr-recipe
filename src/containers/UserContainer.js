import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { usePreloader } from "../lib/PreloadContext"
import { getUser } from "../modules/users"
import User from "../components/User"

const UserContainer = ({ id }) => {
  const user = useSelector(state => state.users.user)
  const dispatch = useDispatch()
  usePreloader(() => dispatch(getUser(id))) // 서버 사이드 렌더링을 할 때 API 호출하기
  useEffect(() => {
    if (user?.id === parseInt(id, 10)) return // 사용자가 존재하고, id가 일치한다면 요청하지 않음
    dispatch(getUser(id))
  }, [dispatch, id, user])

  if (!user) return null
  return <User user={user} />
}

export default UserContainer