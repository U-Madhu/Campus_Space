const LoadMoreDataBtn = ({ state, fetchDataFun, additionalParam }) => {
    if (!state || !state.results || !state.results.length || !state.totalDocs || Number(state.totalDocs) <= state.results.length) {
        return null;
    }

    return (
        <button
            onClick={() => fetchDataFun({ ...additionalParam, page: (state.page || 1) + 1 })}
            className="text-dark-grey p-2 px-4 hover:bg-grey/40 rounded-full flex items-center gap-2 text-xs font-bold transition-all mx-auto my-6 border border-grey"
        >
            Load More
        </button>
    );
};

export default LoadMoreDataBtn;