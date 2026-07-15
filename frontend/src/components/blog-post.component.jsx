import { getDay } from "../common/date";
import { Link } from 'react-router-dom';

const BlogPostCard = ({ content, author }) => {
    let { publishedAt, tags, title, des, banner, activity: { total_likes, total_reads }, blog_id: id } = content;
    let { fullname, profile_img, username } = author;

    return (
        <Link 
            to={`/blog/${id}`} 
            className="flex flex-col h-full bg-white border border-grey rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
        >
            {/* Card Banner */}
            <div className="aspect-video w-full bg-grey overflow-hidden relative">
                <img 
                    src={banner} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    alt={title}
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-black text-[10px] font-bold py-0.5 px-2 rounded-full shadow-sm">
                    {tags[0]}
                </span>
            </div>

            {/* Card Content */}
            <div className="flex flex-col flex-grow p-4 justify-between">
                <div>
                    {/* Author & Date */}
                    <div className="flex gap-2 items-center mb-3">
                        <img src={profile_img} className="w-5 h-5 rounded-full object-cover" alt={fullname}/>
                        <div className="flex flex-col">
                            <p className="text-xs font-semibold text-black line-clamp-1">{fullname}</p>
                            <p className="text-[10px] text-dark-grey">@{username} • {getDay(publishedAt)}</p>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-base font-bold leading-5 text-black mb-2 line-clamp-2 group-hover:text-purple transition-colors duration-200">
                        {title}
                    </h1>

                    {/* Description */}
                    <p className="text-xs font-gelasio leading-4 text-dark-grey line-clamp-2 mb-3">
                        {des}
                    </p>
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-grey mt-auto">
                    <span className="text-[11px] text-purple font-semibold flex items-center gap-1">
                        Read post <i className="fi fi-rr-arrow-right mt-0.5"></i>
                    </span>
                    <div className="flex items-center gap-3 text-dark-grey text-xs">
                        <span className="flex items-center gap-1">
                            <i className="fi fi-rr-eye text-base" />
                            {total_reads || 0}
                        </span>
                        <span className="flex items-center gap-1">
                            <i className="fi fi-rr-heart text-base text-red/80" />
                            {total_likes}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default BlogPostCard;