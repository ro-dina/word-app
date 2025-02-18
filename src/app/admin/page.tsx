"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const Page: React.FC = () => {
  return (
    <main>
      <div className="mb-2 text-2xl font-bold">管理者機能の一覧</div>
      <ul>
        <li>
          <FontAwesomeIcon icon={faArrowRight} className="mr-2" />
          <Link className="text-blue-500 underline" href="/admin/words/new">
            単語の新規作成
          </Link>
        </li>
      </ul>
    </main>
  );
};

export default Page;
