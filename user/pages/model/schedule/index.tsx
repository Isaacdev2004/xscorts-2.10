import { Layout } from 'antd';
import { MySchedules } from '@components/performer/schedules/my-schedules';
import SeoMetaHead from '@components/common/seo-meta-head';

function SchedulesPage() {
  return (
    <Layout>
      <SeoMetaHead item={{ title: 'Schedule' }} />
      <MySchedules />
    </Layout>
  );
}

SchedulesPage.authenticate = true;

export default SchedulesPage;
