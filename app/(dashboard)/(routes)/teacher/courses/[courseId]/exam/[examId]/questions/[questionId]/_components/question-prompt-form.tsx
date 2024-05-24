"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface QuestionPromptFormProps {
  initialData: {
    prompt: string;
  };
  courseId: string;
  examId: string;
  questionId: string;
}

const formSchema = z.object({
  prompt: z.string().min(1),
});

export const QuestionPromptForm = ({
  initialData,
  courseId,
  examId,
  questionId,
}: QuestionPromptFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/exam/${examId}/questions/${questionId}`,
        values
      );
      toast.success("تم تحديث السؤال");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("هناك شئ غير صحيح");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        موجه السؤال
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>يلغي</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              تحرير المطالبة
            </>
          )}
        </Button>
      </div>
      {!isEditing && <div className="text-sm mt-2">{initialData.prompt}</div>}
      {isEditing && (
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
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'ما هو HTML'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                يحفظ
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
