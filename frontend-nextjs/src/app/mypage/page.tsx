'use client';

import withAuth from "@/hocs/withAuth";
import { useAuth } from "@/context/AuthContext";

function MyPage() {
    const { user, logout } = useAuth();

    return (
        <section className="flex-grow container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-text-main mb-8">마이페이지</h1>
                
                <div className="bg-gray-800 p-6 rounded-lg border border-border mb-6">
                    <h2 className="text-xl font-semibold text-primary mb-4">사용자 정보</h2>
                    <div className="space-y-3">
                        <div>
                            <span className="text-text-secondary">아이디:</span>
                            <span className="text-text-main ml-2">{user?.username}</span>
                        </div>
                        <div>
                            <span className="text-text-secondary">이름:</span>
                            <span className="text-text-main ml-2">{user?.name}</span>
                        </div>
                        <div>
                            <span className="text-text-secondary">이메일:</span>
                            <span className="text-main ml-2">{user?.email}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg border border-border mb-6">
                    <h2 className="text-xl font-semibold text-primary mb-4">계정 관리</h2>
                    <div className="space-y-3">
                        <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                            프로필 수정
                        </button>
                        <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition-colors ml-2">
                            비밀번호 변경
                        </button>
                    </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg border border-border">
                    <h2 className="text-xl font-semibold text-primary mb-4">활동 내역</h2>
                    <p className="text-text-secondary">참여한 프로젝트와 활동 내역이 여기에 표시됩니다.</p>
                </div>
            </div>
        </section>
    );
}

// MyPage 컴포넌트를 withAuth로 감싸서 export 합니다.
export default withAuth(MyPage);