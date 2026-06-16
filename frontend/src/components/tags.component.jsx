import { useContext } from "react";
import { EditorContext } from "../pages/editor.pages";

const Tag = ({ tag, tagIndex }) => {

    const { blog, blog: { tags }, setBlog } = useContext(EditorContext);

    const handleTagDelete = () => {
        const updatedTags = tags.filter((_, i) => i !== tagIndex);
        setBlog({ ...blog, tags: updatedTags });
    };

    const handleTagEdit = (e) => {
        if (e.type === "blur" || e.key === "Enter" || e.key === ",") {
            e.preventDefault();

            let currentTag = e.target.innerText.trim().toLowerCase();

            // delete if empty
            if (!currentTag) {
                const updatedTags = tags.filter((_, i) => i !== tagIndex);
                setBlog({ ...blog, tags: updatedTags });
                return;
            }

            // prevent duplicates
            if (tags.includes(currentTag) && currentTag !== tag) return;

            const updatedTags = [...tags];
            updatedTags[tagIndex] = currentTag;

            setBlog({ ...blog, tags: updatedTags });

            e.target.blur(); // exit edit mode
        }
    };

    return (
        <div className="relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-10">

            <p
                className="outline-none"
                contentEditable={true}
                suppressContentEditableWarning={true}
                onKeyDown={handleTagEdit}
                onBlur={handleTagEdit}
            >
                {tag}
            </p>

            <button
                className="mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2"
                onClick={handleTagDelete}
            >
                <i className="fi fi-br-cross text-sm pointer-events-none" />
            </button>

        </div>
    );
};

export default Tag;