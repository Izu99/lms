import StudentLayout from "../../../layout";

export default function StudentPaperAnswersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StudentLayout>{children}</StudentLayout>;
}
