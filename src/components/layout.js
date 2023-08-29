import Nav from './Nav'
export default function Layout({ children, user, onAuthentication, onLogout }){
    return (
    <div className=' m-2 flex flex-col gap-4'>
        <Nav user={user}/>

        <div className=' mx-14' style={{height:'85%'}}>{children}</div>
    </div>
    )
}