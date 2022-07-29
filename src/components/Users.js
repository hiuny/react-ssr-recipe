import { Link } from "react-router-dom"

const Users = ({ users }) => {
  if (!users) return null
  return (
    <div>
      <ul>
        {users.map(o => (
          <li key={o.id}>
            <Link to={`/users/${o.id}`}>{o.username}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Users