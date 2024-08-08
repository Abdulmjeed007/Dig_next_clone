import { Preview } from "@/components/preview"
import { db } from "@/lib/db"
import { isTeacher } from "@/lib/teacher"
import { auth } from "@clerk/nextjs"
import { LibraryForm } from "./_components/LibraryForm"
import { DialogBox } from "../../_components/dialogueBox"


const Library = async () => {
    const {userId} = auth()
    const context = await db.libraryText.findFirst()
    return(
        <div dir="rtl" className="h-full">
            <DialogBox page="libraryPage" />
            <LibraryForm  defaultContext={context?.context!} isTeacher={isTeacher(userId)}/>
        </div>
    )
}

export default Library