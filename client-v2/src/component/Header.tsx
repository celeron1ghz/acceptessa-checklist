import { Link } from 'wouter';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUser, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'

export default function Header(param: { user: { member_id: string } | null }) {
  return (
    <div className='container-fluid' style={{ position: 'fixed' }}>
      <nav>
        <ul>
          <li>
            <strong>
              <Link href="/" style={{ color: 'none' }}>
                Acceptessa 入場業務
              </Link>
            </strong>
          </li>
        </ul>
        <ul>
          {/* <li><a href="#" className="contrast">About</a></li> */}
          {
            !param.user &&
            <li>
              {/* <FontAwesomeIcon icon={faSpinner} className='spinner' />
              &nbsp; */}
              読み込み中...
            </li>
          }
          {
            param.user &&
            <li>
              <FontAwesomeIcon icon={faUser} />
              &nbsp;
              {param.user.member_id}
            </li>
          }
        </ul>
      </nav>
    </div>
  )
}
