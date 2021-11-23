export interface Logos {
  light: string;
  dark: string;
}

export interface League {
  id: string;
  name: string;
  slug: string;
  abbr: string;
  logos: Logos;
}

type LeagueInfoProps = {
  league: League;
};

export const LeagueInfo = ({ league }: LeagueInfoProps) => {
  const { id, name, slug, abbr, logos } = league;
  const { light, dark } = logos;
  return (
    <section key={id}>
      <div>
        <h2>{name}</h2>
        <h3>{abbr}</h3>
        <picture>
          <source srcSet={light} media="(min-width: 800px)" />
          <img src={dark} alt={name} />
        </picture>
      </div>
    </section>
  );
};
