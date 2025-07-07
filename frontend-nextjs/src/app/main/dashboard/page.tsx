import Link from "next/link";

export default function DashboardPage() {
    return (
        <main className="flex-grow container mx-auto px-4 py-16 text-center">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-extrabold text-text-main leading-tight mb-4">
                    당신의 아이디어를<br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            현실
          </span>
                    로 만드는 곳
                </h1>
                <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mt-6 mb-10">
                    Project03은 최고의 개발자, 디자이너, 기획자를 연결하여 멋진 프로젝트를 함께 만들어나가는 플랫폼입니다.
                </p>
                <div className="flex justify-center space-x-4">
                    <Link
                        href="/projects"
                        className="bg-accent text-white font-semibold px-8 py-3 rounded-lg hover:bg-purple-700 transition-transform transform hover:scale-105"
                    >
                        프로젝트 참여하기
                    </Link>
                    <Link
                        href="/recruit"
                        className="bg-gray-700 text-text-main font-semibold px-8 py-3 rounded-lg hover:bg-gray-600 transition-transform transform hover:scale-105"
                    >
                        팀원 모집하기
                    </Link>
                </div>
            </div>

            <div className="mt-24">
                <h2 className="text-3xl font-bold text-text-main mb-12">Project03 작동 방식</h2>
                <div className="grid md:grid-cols-3 gap-8 text-left">
                    <div className="bg-gray-800 p-6 rounded-lg border border-border">
                        <h3 className="text-xl font-bold text-primary mb-2">1. 프로필 등록</h3>
                        <p className="text-text-secondary">당신의 기술 스택과 경험을 보여주는 프로필을 만들고 멋진 프로젝트들을 만나보세요.</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg border border-border">
                        <h3 className="text-xl font-bold text-primary mb-2">2. 프로젝트 탐색</h3>
                        <p className="text-text-secondary">다양한 분야의 프로젝트를 탐색하고, 당신의 성장을 도와줄 팀에 합류하세요.</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg border border-border">
                        <h3 className="text-xl font-bold text-primary mb-2">3. 팀 구성 및 개발</h3>
                        <p className="text-text-secondary">아이디어가 있다면 직접 팀원을 모집하고, 프로젝트를 성공으로 이끌어 보세요.</p>
                    </div>
                </div>
            </div>
        </main>
    )
}