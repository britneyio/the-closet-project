function Page() {
    return (
        <>
            <Nav />
            <PageFull>
                <PageContentContainer fullPage={(location.pathname === "/my-certification" || location.pathname === "/my-certification/benefits" ||  location.pathname === "/my-certification/manage"
                    || location.pathname.includes("activate") || location.pathname.includes("renew") || location.pathname === "/my-certification/profile")}>
                    <PageContent>

                        {((location.pathname === "/my-certification")  ||
                                (location.pathname === "/my-certification/manage") ||
                                (location.pathname === "/my-certification/benefits") ||
                                (location.pathname === "/my-certification/profile"))
                            &&
                            <CertificationTrainingsList />}
                        {((location.pathname === "/my-certification/activate") || (location.pathname === "/my-certification/activate/checkout") || (location.pathname === "/my-certification/renew")|| (location.pathname === "/my-certification/renew/checkout")) &&
                            (<FirmActivateCertification />)}


                    </PageContent>
                </PageContentContainer>
            </PageFull>
        </>
    );
}