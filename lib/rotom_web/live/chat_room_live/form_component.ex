defmodule RotomWeb.ChatRoomLive.FormComponent do
  use RotomWeb, :live_component

  alias Rotom.Chat
  alias Rotom.Chat.Room

  import RotomWeb.RoomComponents

  def render(assigns) do
    ~H"""
    <div id="new-room-form">
      <.room_form form={@form} target={@myself} />
    </div>
    """
  end

  def mount(socket) do
    changeset = Chat.change_room(%Room{})

    socket =
      socket
      |> assign_form(changeset)

    {:ok, socket}
  end

  def handle_event("validate-room", %{"room" => room_params}, socket) do
    changeset =
      %Room{}
      |> Chat.change_room(room_params)
      |> Map.put(:action, :validate)

    socket
    |> assign_form(changeset)

    {:noreply, socket}
  end

  def handle_event("save-room", %{"room" => room_params}, socket) do
    case Chat.create_room(room_params) do
      {:ok, room} ->
        Chat.join_room!(room, socket.assigns.current_user)

        socket =
          socket
          |> put_flash(:info, "Created room")
          |> push_navigate(to: ~p"/rooms/#{room}")

        {:noreply, socket}

      {:error, %Ecto.Changeset{} = changeset} ->
        socket =
          socket
          |> assign_form(changeset)

        {:noreply, socket}
    end
  end

  defp assign_form(socket, changeset) do
    assign(socket, :form, to_form(changeset))
  end
end
