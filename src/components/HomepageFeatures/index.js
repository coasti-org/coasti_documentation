import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Easy to Use',
    Svg: require('@site/static/img/Bildung_icon.svg').default,
    description: (
      <>
        Coasti was designed from the ground up to be easily installed and
        used to get your data pipeline, reports and dashboards up and running quickly.
      </>
    ),
  },
  {
    title: 'Focus on What Matters',
    Svg: require('@site/static/img/regio.svg').default,
    description: (
      <>
        Coasti lets you focus on your dashboards, KPIs, and metrics, and we&apos;ll do the chores.
      </>
    ),
  },
  {
    title: 'Powered by Open Source',
    Svg: require('@site/static/img/soziales.svg').default,
    description: (
      <>
        Design your reports using Superset. Update your content packages using Copier. 
        Coasti is built on top of open source tools, and we are actively contributing to the community.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
