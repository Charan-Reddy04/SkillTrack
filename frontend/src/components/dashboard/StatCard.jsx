
function StatCard({ title, value, subtitle, icon: Icon, color, bg }) {
    return (
        <div className="min-w-0 rounded-2xl border border-[#EAE6FA] bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">

            <div className="flex min-w-0 items-center justify-between gap-3">

                <div className="min-w-0 flex-1">

                    <p className="break-words text-sm font-medium text-[#8991B1]">
                        {title}
                    </p>

                    <h3 className="mt-3 break-words text-2xl font-extrabold text-[#18204D] sm:text-3xl">
                        {value}
                    </h3>

                    <p className="mt-2 break-words text-xs leading-relaxed text-[#9299B5]">
                        {subtitle}
                    </p>

                </div>

                <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12 ${bg} ${color}`}
                >
                    <Icon size={23} />
                </div>

            </div>

        </div>
    );
}

export default StatCard;
