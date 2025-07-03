import Link from "next/link";

export default function Header(){

    return(
        <header>
            <nav>
                <Link href="/">Home</Link>
                    <><Link href="/auth/login">로그인</Link><Link href="/auth/signup">회원가입</Link></>
                    <Link href="/auth/logout">로그아웃</Link>

            </nav>
        </header>
    )
}