const AboutusDetail = () => {
    return (
        <section className="py-10 md:py-20 xl:py-40 dark:bg-secondary">
            <div className="container">
                <div className="flex flex-col xl:flex-row gap-8">
                    <div className="max-w-xl w-full">
                        <h2 className="text-56">Pacepard.</h2>
                    </div>
                    <div className="flex flex-col gap-12">
                        <p className="text-secondary dark:text-white">
                            We operate where technology meets context and
                            execution. Rather than just building software, we
                            engineer systems designed to solve real problems,
                            scale with demand, and adapt to the people who use
                            them. From high-performance web and mobile products
                            to AI-driven solutions and intentional product
                            design, we transform complex ideas into
                            production-ready technology. Every build is rooted
                            in strategy, crafted with precision, and built for
                            longevity.
                        </p>
                        <p className="text-secondary dark:text-white">
                            What defines us is how we work. We bring technical
                            rigor, collaborative thinking, and real-world
                            awareness to every project designing AI for
                            deployment, not demos, and products made to perform
                            beyond first impressions. We partner with teams who
                            need more than delivery they need technology that
                            lasts, scales, and creates measurable impact.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutusDetail;
