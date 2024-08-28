<script setup>
import avatar1 from '@images/avatars/avatar-1.png'
import axios from "@/AxiosFile";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { ref, onMounted } from 'vue';

const username = ref()
const role = ref()
const router = useRouter();

const handleLogout = async() =>{
  try{
    const response = await axios.post('logout-user')
    if(response.data){
      localStorage.removeItem("token")
      localStorage.removeItem("role")
      toast("Logged Out Successfully", {
          theme: "auto",
          type: "success",
          pauseOnHover: false,
          pauseOnFocusLoss: false,
          dangerouslyHTMLString: true,
        });
        setTimeout(()=>{
          router.push('/login')
        },2000)
    }
  }catch(e){
    console.error(e)
    toast("API call failed:", e, {
      theme: "auto",
      type: "warning",
      pauseOnHover: false,
      pauseOnFocusLoss: false,
      dangerouslyHTMLString: true,
    });
  }finally{
    loadingStore.stopLoading(); 
  }
  
}

const handleProfile = ()=>{
  router.push('/user-information')
}

const userDetails = async () => {
  try {
    const response = await axios.get("user-details");
    const data = response.data;
    username.value = data.username.toUpperCase();
    const userrole = localStorage.getItem("role")
    role.value = userrole;
  } catch (error) {
    console.error('Error fetching user details:', error);
  }
};


onMounted(()=>{
  userDetails()
})

</script>

<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    bordered
    color="success"
  >
    <VAvatar
      class="cursor-pointer"
      color="primary"
      variant="tonal"
    >
      <VImg :src="avatar1" />

      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="230"
        location="bottom end"
        offset="14px"
      >
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar
                    color="primary"
                    variant="tonal"
                  >
                    <VImg :src="avatar1" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ username }}
            </VListItemTitle>
            <VListItemSubtitle>
              {{ role }}
            </VListItemSubtitle>
          </VListItem>

          <VDivider class="my-2" />

          <!-- 👉 Profile -->
          <VListItem link>
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-user"
                size="22"
              />
            </template>

            <VListItemTitle @click="handleProfile">Profile</VListItemTitle>
          </VListItem>

          <!-- Divider -->
          <VDivider class="my-2" />

                    <!-- 👉 Profile -->
                    <VListItem link @click="() => $router.push({ name: 'change-password' })">
                      <template #prepend>
                        <VIcon
                          class="me-2"
                          icon="tabler-password-user"
                          size="22"
                        />
                      </template>
          
                      <VListItemTitle >
                        Change Password
                      </VListItemTitle>
                    </VListItem>
          
                    <!-- Divider -->
                    <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <VListItem @click="handleLogout">
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-logout"
                size="22"
              />
            </template>

            <VListItemTitle>Logout</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
