import Nav from './Nav'
export default function Layout({children}){
    return (
    <div className='mx-14'>
        <Nav></Nav>
        <div className='w-full' style={{height:'85%'}}>{children}</div>
    </div>
    )
}