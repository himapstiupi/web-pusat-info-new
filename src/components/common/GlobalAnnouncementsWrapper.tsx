import { getPublicAnnouncements } from "@/actions/announcements";
import GlobalAnnouncementsClient from "./GlobalAnnouncementsClient";

export default async function GlobalAnnouncementsWrapper() {
    const announcements = await getPublicAnnouncements();

    if (!announcements || announcements.length === 0) {
        return null;
    }

    return <GlobalAnnouncementsClient announcements={announcements} />;
}
