import { Outlet } from 'react-router-dom'
import UsersContainer from '../containers/UsersContainer'

const UsersPage = () => {
  return (
    <>
      <UsersContainer />
      <Outlet />
    </>
  )
}

export default UsersPage