import { useEffect } from "react";
import styled from "styled-components";
import { tokens } from "shared/tokens";
import { useAppDispatch, useAppSelector } from "shared/store/hooks";
import { fetchNotifications, markAllRead, markRead } from "shared/store/notificationsSlice";
import { Button, Heading, Spinner } from "../../ui";

const color = tokens.color;

export default function NotificationsPage() {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((state) => state.notifications);

  useEffect(() => {
    void dispatch(fetchNotifications());
  }, [dispatch]);

  return (
    <Wrap>
      <Header>
        <Heading>Notifications</Heading>
        <Button $variant="ghost" onClick={() => void dispatch(markAllRead())}>
          Mark all read
        </Button>
      </Header>

      {status === "loading" && items.length === 0 ? (
        <Center>
          <Spinner />
        </Center>
      ) : items.length === 0 ? (
        <Empty>You're all caught up.</Empty>
      ) : (
        <List>
          {items.map((notification) => (
            <Item key={notification.id} $unread={!notification.read}>
              <div>
                <div className="t">{notification.title}</div>
                <div className="b">{notification.body}</div>
              </div>
              {!notification.read && (
                <button onClick={() => void dispatch(markRead(notification.id))} aria-label="Mark read">
                  Mark read
                </button>
              )}
            </Item>
          ))}
        </List>
      )}
    </Wrap>
  );
}

const Wrap = styled.div`
  max-width: 640px;
  margin: 0 auto;
  padding: 32px 20px 60px;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;
const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const Item = styled.div<{ $unread: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid ${color.border};
  border-left: 3px solid ${(props) => (props.$unread ? color.primary : color.border)};
  border-radius: 10px;
  background: ${(props) => (props.$unread ? color.primarySoft : color.background)};
  .t {
    font-weight: 600;
    font-size: 14px;
  }
  .b {
    font-size: 13px;
    color: ${color.textSoft};
    margin-top: 2px;
  }
  button {
    flex: none;
    font-family: ${tokens.font.mono};
    font-size: 10px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    background: ${color.textStrong};
    color: #fff;
    border: 0;
    border-radius: 8px;
    padding: 8px 11px;
    cursor: pointer;
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
