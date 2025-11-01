import Message from './Message'
import User from './User'

function Home() {
  return (
    <div>
        <div className="row h-100">
            <div className="col-4">
                <User/>
            </div>
            <div className="col-6">
                <Message/>
            </div>
        </div>
    </div>
  )
}

export default Home