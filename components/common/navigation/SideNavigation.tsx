"use client";

// components/common/navigation/SideNavigation.tsx
import { Button } from "@/components/ui/button";
import styles from "./sideNavigation.module.scss";
import { Dot, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/app/utils/supabase";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const SideNavigation = () => {
  const router = useRouter();
  const [todos, setTodos] = useState<any>([]);

  const onCreate = async () => {
    console.log("함수 호출");

    // supabase db에 row 데이터 생성

    const { error, status } = await supabase
      .from("todos")
      .insert([{ title: "", start_date: "", end_date: "", contents: [] }]);

    if (error) {
      console.log(error);
    }

    if (status === 201) {
      toast({
        title: "페이지 생성 완료",
        description: "새로운 투두리스트가 생성 되었습니다.",
      });
      router.push("/create");
    }
  };

  // supabase에 기존에 생성된 페이지가 있는지 없는지 체크
  const getTodos = async () => {
    let {
      data: todos,
      error,
      status,
    } = await supabase.from("todos").select("*");

    if (status === 200) {
      setTodos(todos);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.container__serchBox}>
        <Input
          type="text"
          placeholder="검색어를 입력해주세요."
          className="focus-visible:ring-0"
        />
        <Button variant={"outline"} size="icon">
          <Search />
        </Button>
      </div>
      <div className={styles.container__buttonBox}>
        <Button
          onClick={onCreate}
          variant={"outline"}
          className="w-full text-orange-500 border-orange-400 hover:bg-orange-50 hover:text-orange-500"
        >
          Add New Page
        </Button>
      </div>
      <div className={styles.container__todos}>
        <span className={styles.container__todos__label}>Your To do</span>
        {/* Is Supabase Todos */}

        <div className={styles.container__todos__list}>
          {todos &&
            todos.map((item: any) => {
              return (
                <div
                  key={item.id}
                  className="flex items-center py-2 bg-[#f5f5f4] rounded-sm cursor-pointer"
                >
                  <Dot className="mr-1 text-green-400"></Dot>
                  <span className="text-sm">
                    {item.title === "" ? "제목없음" : item.title}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default SideNavigation;
