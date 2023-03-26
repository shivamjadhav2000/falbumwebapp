import Nav from './Nav'
export default function Layout({children}){
    return (
    <div className=' m-2 flex flex-col gap-4'>
        <Nav></Nav>

        <div className=' mx-14' style={{height:'85%'}}>{children}</div>
    </div>
    )
}