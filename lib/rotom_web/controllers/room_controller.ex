defmodule RotomWeb.RoomController do
  use RotomWeb, :controller

  alias Rotom.Chat

  def redirect_to_first(conn, _params) do
    path =
      case Chat.list_joined_rooms(conn.assigns.current_user) do
        [] -> ~p"/rooms"
        [first_room | _] -> ~p"/rooms/#{first_room.id}"
      end

    redirect(conn, to: path)
  end
end
