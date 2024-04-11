import { NgModule } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/core/modules/shared.module';
import { UserProfileFmsComponent } from './user-profile-fms/user-profile-fms.component';
import { profileRoutingModule } from 'src/app/core/modules/routing/user-profile-routing.module';


@NgModule({
  declarations: [UserProfileFmsComponent],
  imports: [
    CommonModule,
    SharedModule,
    profileRoutingModule,
    FormsModule,
    ImageModule,
  ],
})

export class profileModule {}
