import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { tokens } from "shared/tokens";
import { useAppDispatch, useAppSelector } from "shared/store/hooks";
import { fetchOutfits } from "shared/store/outfitsSlice";
import { Card, Chip, Heading, Spinner } from "../../ui";

const color = tokens.color;

// Filters derived from item attributes present on an outfit's items.
const FILTERS = ["All", "Casual", "Formal", "Summer", "Winter"];

export default function OutfitsPage() {
  const dispatch = useAppDispatch();
  const { outfits, status } = useAppSelector((state) => state.outfits);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    void dispatch(fetchOutfits());
  }, [dispatch]);

  const visible = useMemo(() => {
    if (filter === "All") return outfits;
    const filterValue = filter.toLowerCase();
    return outfits.filter((outfit) =>
      outfit.items.some(
        (item) =>
          item.formality?.toLowerCase() === filterValue ||
          item.season?.toLowerCase() === filterValue
      )
    );
  }, [outfits, filter]);

  return (
    <Layout>
      <Sidebar aria-label="Filter outfits">
        <h3>Filter</h3>
        {FILTERS.map((option) => (
          <Chip key={option} $active={filter === option} onClick={() => setFilter(option)}>
            {option}
          </Chip>
        ))}
      </Sidebar>
      <Content>
        <Heading>My Outfits</Heading>
        {status === "loading" && outfits.length === 0 ? (
          <Center>
            <Spinner />
          </Center>
        ) : visible.length === 0 ? (
          <Empty>No outfits yet. Build one in the Creator or ask the Stylist.</Empty>
        ) : (
          <Grid>
            {visible.map((outfit) => (
              <Card key={outfit.id}>
                <Tiles>
                  {outfit.items.slice(0, 4).map((item) => (
                    <span key={item.id} style={item.cover_file ? { backgroundImage: `url(${item.cover_file})` } : undefined} />
                  ))}
                </Tiles>
                <Meta>
                  <h4>{outfit.name}</h4>
                  {outfit.about && <p>{outfit.about}</p>}
                </Meta>
              </Card>
            ))}
          </Grid>
        )}
      </Content>
    </Layout>
  );
}

const Layout = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  min-height: calc(100dvh - 68px);
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;
const Sidebar = styled.nav`
  border-right: 1px solid ${color.border};
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  h3 {
    font-family: ${tokens.font.heading};
    font-size: 15px;
    margin: 0 0 8px;
  }
  @media (max-width: 800px) {
    border-right: 0;
    border-bottom: 1px solid ${color.border};
    flex-direction: row;
    overflow-x: auto;
    h3 {
      display: none;
    }
  }
`;
const Content = styled.div`
  padding: 26px;
  @media (max-width: 600px) {
    padding: 16px;
  }
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 18px;
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
const Tiles = styled.div`
  display: flex;
  height: 170px;
  background: ${color.surface};
  span {
    flex: 1;
    background-size: cover;
    background-position: center;
    border-right: 1px solid ${color.background};
  }
  span:last-child {
    border-right: 0;
  }
`;
const Meta = styled.div`
  padding: 14px 16px;
  h4 {
    font-family: ${tokens.font.heading};
    margin: 0 0 4px;
    font-size: 16px;
  }
  p {
    margin: 0;
    font-size: 13px;
    color: ${color.textSoft};
  }
`;
const Center = styled.div`
  display: grid;
  place-items: center;
  padding: 60px;
`;
const Empty = styled.p`
  color: ${color.textSoft};
  text-align: center;
  padding: 40px;
`;
