import Avatar from 'react-avatar'
import PropTypes from 'prop-types'

export default function User({username}){
    // console.log(username)
    return(
        <>
            <div className="text-textL font-bold w-16 h-[4.5rem] overflow-hidden">
                <Avatar name={username} size='3rem' className='rounded-xl'/>
                <p className='text-sm py-1'>{username}</p>                
            </div>
        </>
    )
}

User.propTypes = {
    username: PropTypes.string.isRequired
}