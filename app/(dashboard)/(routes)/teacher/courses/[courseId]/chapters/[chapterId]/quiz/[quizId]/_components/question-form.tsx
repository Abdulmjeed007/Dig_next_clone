"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Quiz, QuizQuestion } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

import { QuestionList } from "./question-list";
import { Textarea } from "@/components/ui/textarea";

interface QuestionFormProps {
  initialData: Quiz & { questions: QuizQuestion[] };
  courseId: string;
  chapterId: string;
  quizId: string;
}

const formSchema = z.object({
  prompt: z.string().min(1),
});

export const QuestionForm = ({
  initialData,
  quizId,
  chapterId,
  courseId,
}: QuestionFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleCreating = () => {
    setIsCreating((current) => !current);
  };

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(
        `/api/courses/${courseId}/chapters/${chapterId}/quiz/${quizId}/questions`,
        values
      );
      toast.success("تم إنشاء السؤال");
      toggleCreating();
      form.setValue("prompt", "");
      router.refresh();
    } catch {
      toast.error("هناك شئ غير صحيح");
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);

      await axios.put(
        `/api/courses/${courseId}/chapters/${chapterId}/quiz/${quizId}/questions/reorder`,
        {
          list: updateData,
        }
      );
      toast.success("أعيد ترتيب الأسئلة");
      router.refresh();
    } catch {
      toast.error("هناك شئ غير صحيح");
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = (id: string) => {
    router.push(
      `/teacher/courses/${courseId}/chapters/${chapterId}/quiz/${quizId}/questions/${id}`
    );
  };

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
      سؤال مسابقة الفصل
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>يلغي</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              أضف سؤالا
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عنوان السؤال</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. '...ما هو'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={!isValid || isSubmitting} type="submit">
              يخلق
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.questions.length && "text-slate-500 italic"
          )}
        >
          {!initialData.questions.length && "لا توجد أسئلة"}
          <QuestionList
            onEdit={onEdit}
            onReorder={onReorder}
            items={initialData.questions || []}
          />
        </div>
      )}
      {!isCreating && (
        <div className="text-xs text-muted-foreground mt-4">
          قم بالسحب والإسقاط لإعادة ترتيب الأسئلة
        </div>
      )}
    </div>
  );
};
