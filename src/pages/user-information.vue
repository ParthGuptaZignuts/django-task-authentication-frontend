<script setup>
import { ref, onMounted } from 'vue';
import axios from "@/AxiosFile";

const userData = ref({
  username: '',
  email: '',
  firstName: '',
  lastName: '',
  fullName: '',
  isActive: false,
  isStaff: false,
  role: '',
  userRoles: [],
  status: '',
  avatar: null,
});

const userDetails = async () => {
  try {
    const response = await axios.get("user-details");
    const data = response.data;
  
    // Map the response data to the userData object
    userData.value.username = data.username || '';
    userData.value.email = data.email || '';
    userData.value.firstName = data.first_name || '';
    userData.value.lastName = data.last_name || '';
    userData.value.fullName = data.first_name || data.last_name 
      ? `${data.first_name} ${data.last_name}` 
      : data.username;
    userData.value.isActive = data.is_active || false;
    userData.value.isStaff = data.is_staff || false;
    userData.value.status = data.is_active ? 'active' : 'inactive';

    // Map user roles and permissions
    userData.value.userRoles = data.user_roles?.map(role => ({
      id: role.id,
      name: role.role?.name || 'Unknown',
      permissions: role.role_permissions?.map(permission => ({
        id: permission.id,
        module: permission.permission.module || 'Unknown',
        action: permission.permission.permission || 'Unknown',
      })) || [],
    })) || [];

    // Set role for display (assuming there's only one role)
    userData.value.role = userData.value.userRoles.length 
      ? userData.value.userRoles[0].name.toLowerCase() 
      : 'user';

  } catch (error) {
    console.error('Error fetching user details:', error);
  }
};

onMounted(() => {
  userDetails();
});
</script>


<template>
  <div>
    <VRow>
      <!-- SECTION User Details -->
      <VCol cols="12">
        <VCard>
          <VCardText class="text-center pt-15">
            <!-- 👉 Avatar -->
            <VAvatar
              rounded
              :size="100"
              :color="!userData.avatar ? 'primary' : undefined"
              :variant="!userData.avatar ? 'tonal' : undefined"
            >
              <VImg
                v-if="userData.avatar"
                :src="userData.avatar"
              />
              <span
                v-else
                class="text-5xl font-weight-medium"
              >
                {{ userData.fullName }}
              </span>
            </VAvatar>

            <!-- 👉 User fullName -->
            <h6 class="text-h4 mt-4">
              {{ userData.fullName }}
            </h6>

            <!-- 👉 Role chip -->
            <VChip
              label
              :color="(userData.role).color"
              size="small"
              class="text-capitalize mt-3"
            >
              {{ userData.role }}
            </VChip>
          </VCardText>

          <VDivider />

          <!-- 👉 Details -->
          <VCardText>
            <p class="text-sm text-uppercase text-disabled">
              Details
            </p>

            <!-- 👉 User Details list -->
            <VList class="card-list mt-2">
              <VListItem>
                <VListItemTitle>
                  <h6 class="text-h6">
                    Username:
                    <span class="text-body-1">
                      {{ userData.username }}
                    </span>
                  </h6>
                </VListItemTitle>
              </VListItem>

              <VListItem>
                <VListItemTitle>
                  <h6 class="text-h6">
                    Email:
                    <span class="text-body-1">{{ userData.email }}</span>
                  </h6>
                </VListItemTitle>
              </VListItem>

              <VListItem>
                <VListItemTitle>
                  <h6 class="text-h6">
                    Status:
                    <VChip
                      label
                      size="small"
                      :color="(userData.status)"
                      class="text-capitalize"
                    >
                      {{ userData.status }}
                    </VChip>
                  </h6>
                </VListItemTitle>
              </VListItem>

              <!-- Modules and Permissions -->
              <VListItem v-for="(role, index) in userData.userRoles" :key="index">
                <VListItemTitle>
                  <h6 class="text-h6">
                    Role: <span class="text-body-1">{{ role.name }}</span>
                  </h6>
                </VListItemTitle>

                <VList v-if="role.permissions.length">
                  <VListItem v-for="(permission, pIndex) in role.permissions" :key="pIndex">
                    <VListItemTitle>
                      <h6 class="text-h6">
                        Module: <span class="text-body-1">{{ permission.module }}</span> - 
                        Action: <span class="text-body-1">{{ permission.action }}</span>
                      </h6>
                    </VListItemTitle>
                  </VListItem>
                </VList>
              </VListItem>
            </VList>
          </VCardText>
        </VCard>
      </VCol>
      <!-- !SECTION -->
    </VRow>
  </div>
</template>




<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 0.75rem;
}

.text-capitalize {
  text-transform: capitalize !important;
}
</style>
