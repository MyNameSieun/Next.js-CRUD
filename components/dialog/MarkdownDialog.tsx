"use client";

import { supabase } from "@/app/utils/supabase";
import { useState } from "react";

// components
import LabelCalendar from "../common/calendar/LabelCalendar";
import MDEditor from "@uiw/react-md-editor";

// Shadcn UI
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Components
import { DialogClose } from "@radix-ui/react-dialog";

// Shadcn UI
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

// CSS
import styles from "./MarkdownDialog.module.scss";

const MarkdownDialog = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string | undefined>(
    "**Hello, World!!**"
  );
  const [open, setOpen] = useState<boolean>(false);

  const { toast } = useToast();

  // =========================

  // superbase에 저장
  const onSubmit = async () => {
    console.log("함수 호출");

    if (!title || !content) {
      toast({
        title: "기입되지 않은 데이터(값)이 있습니다.",
        description: "제목, 날짜 혹은 콘텐츠 값을 모두 작성해주세요.",
      });
      return;
    } else {
      // Superbase 데이터베이스에 연동

      const { data, error, status } = await supabase
        .from("todos")
        .insert([{ title: title, content: content }])
        .select();

      if (error) {
        console.log(error);
        toast({
          title: "에러가 발생했습니다.",
          description: "콘솔 창에 출력된 에러를 확인하세요.",
        });
      }
      if (status === 201) {
        toast({
          title: "생성 완료!",
          description: "작성한 글이 Supabase에 올바르게 저장되었습니다.",
        });

        // 등록 후 조건 초기화
        setOpen(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <span className="font-normal ">Add Contents</span>
      </DialogTrigger>
      <DialogContent className="max-w-fit">
        <DialogHeader>
          <DialogTitle>
            <div className={styles.dialog__titleBox}>
              <Checkbox className="w-5 h-5" />
              <input
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Write a title for your board."
                className={styles.dialog__titleBox__title}
              />
            </div>
          </DialogTitle>
          <div className={styles.dialog__calendarBox}>
            <LabelCalendar label="From" />
            <LabelCalendar label="To" />
          </div>
          <Separator />
          <div className={styles.dialog__markdown}>
            <MDEditor
              value={content}
              onChange={(value) => setContent(value || "")}
              height={100 + "%"}
              autoFocus={false}
            />
          </div>
        </DialogHeader>

        <DialogFooter>
          <div className={styles.dialog__buttonBox}>
            <DialogClose asChild>
              <Button
                variant={"ghost"}
                className="font-normal text-gray-400 hover:bg-gray-50 hover:text-gray-500"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={onSubmit}
              type={"submit"}
              className="font-normal border-orange-500 bg-orange-400 text-white hover:bg-orange-400 hover:text-white"
            >
              Done
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MarkdownDialog;
